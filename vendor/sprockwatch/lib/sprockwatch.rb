module Sprockets
  module Watch
    def watch!
      previous_mtime = concatenation.mtime

      loop do
        sleep 1
        reset!

        if concatenation.mtime > previous_mtime
          previous_mtime = concatenation.mtime
          yield
        end
      end
    end
  end
end

Sprockets::Secretary.send :include, Sprockets::Watch
