require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

WYSIHAT_ROOT     = File.expand_path(File.dirname(__FILE__))
WYSIHAT_SRC_DIR  = File.join(WYSIHAT_ROOT, 'src')
WYSIHAT_DIST_DIR = File.join(WYSIHAT_ROOT, 'dist')

task :default => :dist

desc "Builds the distribution."
task :dist do
  require File.join(WYSIHAT_ROOT, "vendor", "sprockets")

  Dir.chdir(WYSIHAT_SRC_DIR)

  environment  = Sprockets::Environment.new(".")
  preprocessor = Sprockets::Preprocessor.new(environment)

  %w(wysihat.js).each do |filename|
    pathname = environment.find(filename)
    preprocessor.require(pathname.source_file)
  end

  output = preprocessor.output_file
  File.open(File.join(WYSIHAT_DIST_DIR, "wysihat.js"), 'w') { |f| f.write(output) }
end
