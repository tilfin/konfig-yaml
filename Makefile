mocha=./node_modules/mocha/bin/_mocha
istanbul=./node_modules/.bin/istanbul

test-cov: clean
	$(istanbul) cover $(mocha) -- -R spec test/**/*.test.js

clean:
	rm -fr coverage
