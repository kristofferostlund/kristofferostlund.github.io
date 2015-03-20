[![Deployment status from dploy.io](https://vilth.dploy.io/badge/02267417974794/21230.svg)](http://dploy.io)
# Vilth
Site for Vilth.

Uses [Jekyll](http://jekyllrb.com) and [Grunt](http://gruntjs.com).

## Instructions
### Run Local:
Open two terminal windows and run `grunt serve` in one of them and only `grunt` in the other one.

Every pushed commit will build and then be avaliable on [dev.vilth.se](http://dev.vilth.se).

### Deploy:
Make sure every file is already committed and your branch is clear of changes. Then run `grunt deploy` and that command will:

* Bump version in `package.json`
* Rebuild everything again
* Make a new release-tag
* Commit all files

... and then trigger the real deploy.
