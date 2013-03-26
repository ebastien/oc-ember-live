require 'pathname'

app_path = File.expand_path('../../..', __FILE__)

config_file = File.join app_path, 'release.yml'

config = begin
  YAML.load_file config_file
rescue
  $stderr.puts "Warning: no release configuration found at #{config_file}."
  {}
end

app_name = config['name'] || 'rails-app'
app_version = config['version'] || '0.1.0'
app_iteration= config['iteration'] || '1'
app_arch = config['arch'] || 'all'
app_description = config['description'] || 'A Rails application.'

resources = [
  '.bundle/', '.bundle/config',
  'app/**/*',
  'bin/', 'bin/*',
  'db/', 'db/schema.rb',
  'config/', 'config/**/*',
  'config.ru',
  'Gemfile',
  'Gemfile.lock',
  'lib/', 'lib/**/*',
  'public/', 'public/**/*',
  'Rakefile',
  'vendor/bundle/**/*',
  'vendor/cache/', 'vendor/cache/*'
]

lib_path = "/var/lib/rails"
log_path = "/var/log/rails"
etc_path = "/etc/rails"

app_lib_path = File.join lib_path, app_name
app_log_path = File.join log_path, app_name
app_etc_path = File.join etc_path, app_name

directories = [app_lib_path, app_log_path, app_etc_path]

build_path = File.join app_path, 'tmp/build'

package_name = "#{app_name}_#{app_version}-#{app_iteration}_#{app_arch}.deb"
package_path = File.join build_path, package_name

namespace :build do  

  desc "Prepare dependencies for deployment of #{app_name}."
  task :dependencies do
    system("bundle install --local --binstubs --path vendor/bundle")
  end
  
  desc "Build the distribution files of #{app_name}."
  task :distribution => ['build:dependencies', 'assets:precompile'] do
  
    directories.each do |d|
      dist_dir = File.join build_path, d
      mkdir_p dist_dir
    end
  
    app_pathname = Pathname.new app_path

    resources.each do |resource|
      
      dirs = []
      files = []
    
      FileList[File.join app_path, resource].each do |source|
        relsrc = Pathname.new(source).relative_path_from app_pathname
        case File.ftype source
        when 'directory'
          dirs << relsrc
        when 'file'
          files << relsrc
        end
      end
      
      dirs.each do |d|
        target = File.join build_path, app_lib_path, d
        mkdir_p target
      end
      
      files.each do |f|
        source = File.join app_path, f
        target = File.join build_path, app_lib_path, f
        cp source, target
      end
    end
  end
  
  desc "Package the application as #{package_name}."
  task :package => 'build:distribution' do
    fpm_bin = File.join app_path, "bin/fpm"
    unless $?.success? && File.executable?(fpm_bin)
      raise "Failed to locate the FPM binary"
    end
    
    root_pathname = Pathname.new('/')
    rel_dirs = directories.map do |d|
      Pathname.new(d).relative_path_from root_pathname
    end

    fpm_cmd = "#{fpm_bin} -p #{package_name} -n #{app_name} -v #{app_version}" \
              " --iteration #{app_iteration} -a #{app_arch}" \
              " --description \"#{app_description}\"" \
              " -t deb -s dir #{rel_dirs.join ' '}"
    
    rm_f package_path
    
    ::Dir.chdir(build_path) do
      system(fpm_cmd)
      puts "Package #{package_name} created" if $?.success?
    end
  end
  
end

task 'assets:precompile' => 'build:dependencies'
