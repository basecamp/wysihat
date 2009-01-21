require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

WYSIHAT_ROOT          = File.expand_path(File.dirname(__FILE__))
WYSIHAT_SRC_DIR       = File.join(WYSIHAT_ROOT, 'src')
WYSIHAT_DIST_DIR      = File.join(WYSIHAT_ROOT, 'dist')
WYSIHAT_DOC_DIR       = File.join(WYSIHAT_ROOT, 'doc')
WYSIHAT_TEST_DIR      = File.join(WYSIHAT_ROOT, 'test')
WYSIHAT_TEST_UNIT_DIR = File.join(WYSIHAT_TEST_DIR, 'unit')
WYSIHAT_TMP_DIR       = File.join(WYSIHAT_TEST_UNIT_DIR, 'tmp')

desc "Update git submodules"
task :update_submodules do
  system("git submodule init")
  system("git submodule update")
end

task :default => :dist

desc "Builds the distribution."
task :dist => :update_submodules do
  require File.join(WYSIHAT_ROOT, "vendor", "sprockets", "lib", "sprockets")

  Dir.chdir(WYSIHAT_SRC_DIR)

  environment  = Sprockets::Environment.new(".")
  preprocessor = Sprockets::Preprocessor.new(environment)

  %w(wysihat.js).each do |filename|
    pathname = environment.find(filename)
    preprocessor.require(pathname.source_file)
  end

  output = preprocessor.output_file
  File.open(File.join(WYSIHAT_DIST_DIR, "wysihat.js"), 'w') { |f| f.write(output) }

  prototype_js = File.join(WYSIHAT_ROOT, "vendor", "unittest_js", "assets", "prototype.js")
  FileUtils.cp_r(prototype_js, WYSIHAT_DIST_DIR)
end

desc "Empties the output directory and builds the documentation."
task :doc => ['doc:clean', 'doc:build']

namespace :doc do
  desc "Builds the documentation"
  task :build => :update_submodules do
    require File.join(WYSIHAT_ROOT, "vendor", "pdoc", "lib", "pdoc")
    files = Dir["#{File.expand_path(File.dirname(__FILE__))}/src/**/*.js"]
    files << { :output => WYSIHAT_DOC_DIR }
    PDoc::Runner.new(*files).run
  end

  desc "Empties documentation directory"
  task :clean do
    rm_rf WYSIHAT_DOC_DIR
  end
end

desc "Builds the distribution, runs the JavaScript unit tests and collects their results."
task :test => ['test:build']

namespace :test do
  task :build => [:clean, :dist] do
    require File.join(WYSIHAT_ROOT, "vendor", "unittest_js", "lib", "unittest_js")
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir  => WYSIHAT_TEST_UNIT_DIR,
      :assets_dir => WYSIHAT_DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
  end

  task :clean do
    require File.join(WYSIHAT_ROOT, "vendor", "unittest_js", "lib", "unittest_js")
    UnittestJS::Builder.empty_dir!(WYSIHAT_TMP_DIR)
  end
end
