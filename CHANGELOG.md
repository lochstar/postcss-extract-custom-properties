# Change log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.1.2 - 2016-11-10
### Fixed
- Removed `fs` from devDepdencies, built in module.
- Skip variables defined inside a mixin function.
- Skip variables defined in keyframes.

## 0.1.1 - 2016-08-31
### Fixed
- Test allowed invalid CSS when handling multiple inputs.

## 0.1.0 - 2016-08-11
### Removed
- `output` and `minify` options removed.

### Fixed
Added `fs` to devDepdencies, required for tests.

## 0.0.6 - 2016-08-06
### Changed
- `result.json` renamed to `result.contents`, returns object instead of string.

### Fixed
- More corrent use of warning API.
- Tests tidied up.
- Linted.

### Deprecated
- `output` and `minify` options deprecated. Will be removed in 0.1.0.

## 0.0.5 - 2016-08-04
### Changed
- Use warning API for invalid properties.
- Optional `output` JSON.

## 0.0.4 - 2016-08-03
### Added
- Ignore invalid properties.

### Fixed
- Fixed typo in `README`.

## 0.0.3 - 2016-08-02
### Added
- Added option to minify JSON output.

### Changed
- Avoid duplicating selectors when parsing multiple inputs.

### Fixed
- Fixed tests.
- Fixed `package.json`.

## 0.0.2 - 2016-08-02
### Fixed
- Integration fixes.

## 0.0.1 - 2016-08-02
- First release.
