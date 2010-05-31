require 'rake'
require 'rake/clean'
require 'rake/rdoctask'
require 'rake/testtask'

CLEAN.include 'test/unit/tmp'
CLOBBER.include 'dist'
CLOBBER.include 'doc'

WYSIHAT_ROOT    = File.expand_path(File.dirname(__FILE__))
WYSIHAT_SRC_DIR = File.join(WYSIHAT_ROOT, 'src')


# Distribution

file 'dist/prototype.js' => :sprockets do |t|
  prototype_src_dir = "#{WYSIHAT_ROOT}/vendor/prototype/src"

  secretary = Sprockets::Secretary.new(
    :root         => prototype_src_dir,
    :load_path    => [prototype_src_dir],
    :source_files => ["prototype.js"]
  )

  FileUtils.mkdir_p File.dirname(t.name)
  secretary.concatenation.save_to(t.name)
end

file 'dist/wysihat.js' => Dir['src/**/*'] + [:sprockets] do |t|
  secretary = Sprockets::Secretary.new(
    :root         => WYSIHAT_SRC_DIR,
    :load_path    => [WYSIHAT_SRC_DIR],
    :source_files => ["wysihat.js"]
  )

  FileUtils.mkdir_p File.dirname(t.name)
  secretary.concatenation.save_to(t.name)
end

task :default => :dist

desc "Builds the distribution."
task :dist => ['dist/prototype.js', 'dist/wysihat.js']


# Documentation

desc "Builds the documentation."
file 'doc' => Dir['src/**/*'] + [:sprockets, :pdoc] do
  require 'tempfile'

  Tempfile.open('pdoc') do |temp|
    secretary = Sprockets::Secretary.new(
      :root         => WYSIHAT_SRC_DIR,
      :load_path    => [WYSIHAT_SRC_DIR],
      :source_files => ["wysihat.js"],
      :strip_comments => false
    )

    secretary.concatenation.save_to(temp.path)
    PDoc::Runner.new(temp.path, :destination => "#{WYSIHAT_ROOT}/doc").run
  end
end


# Tests

file 'test/unit/tmp/tests' => Dir['test/unit/*.js'] + [:unittest_js, :dist] do
  FileUtils.mkdir_p File.dirname('test/unit/tmp/tests')

  builder = UnittestJS::Builder::SuiteBuilder.new({
    :input_dir  => "#{WYSIHAT_ROOT}/test/unit",
    :assets_dir => "#{WYSIHAT_ROOT}/dist"
  })
  builder.collect
  builder.render
end

desc "Builds the distribution, runs the JavaScript unit tests and collects their results."
task :test => 'test/unit/tmp/tests'


# Vendored libs

task :sprockets => 'vendor/sprockets/lib/sprockets.rb' do
  $:.unshift File.expand_path('vendor/sprockets/lib', WYSIHAT_ROOT)
  require 'sprockets'
end

task :pdoc => 'vendor/pdoc/lib/pdoc.rb' do
  $:.unshift File.expand_path('vendor/pdoc/lib', WYSIHAT_ROOT)
  require 'pdoc'
end

task :unittest_js => 'vendor/unittest_js/lib/unittest_js.rb' do
  $:.unshift File.expand_path('vendor/unittest_js/lib', WYSIHAT_ROOT)
  require 'unittest_js'
end

file 'vendor/pdoc/lib/pdoc.rb' do
  Rake::Task['update_submodules'].invoke
end

file 'vendor/sprockets/lib/sprockets.rb' do
  Rake::Task['update_submodules'].invoke
end

file 'vendor/unittest_js/lib/unittest_js.rb' do
  Rake::Task['update_submodules'].invoke
end

task :update_submodules do
  system "git submodule init"
  system "git submodule update"
end
