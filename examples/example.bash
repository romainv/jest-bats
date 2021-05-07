#!/usr/bin/env bats

# A dummy function that generates a list of arguments based on a dummy param
getArgs() {
	local param="${1:?}" # Dummy param
	local args
	args=(
		"--default"
		"--foo=${param}"	
	)	
  # Return each argument on a separate line
  printf '%s\n' "${args[@]}"
}

# A dummy function that sets a variable environment
setEnv() {
	export JEST_BATS_TEST="WORKS"
}
