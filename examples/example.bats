load "example"

setup() {
	# Clear from env any prior variables that should be set by the tests
	unset JEST_BATS_TEST
}

@test "getArgs" {
	local args 
	args=($(getArgs "bar")) # Retrieve the list of arguments
	[[ "${args[-1]}" == "--foo=bar" ]] # Check the last arg
}

@test "setEnv" {
	setEnv # Set the environment variable
	[[ "$JEST_BATS_TEST" == "WORKS" ]] # Test the variable's value
}
