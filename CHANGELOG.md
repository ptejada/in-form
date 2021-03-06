# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A `submitting` callback to notify the consumer when the submitting state for the form changes.
- A `handleSubmit` callback as a custom submission handler. Within this callback the user will have full control over
  the submission process.
- Automated test runner.

### Fixed
- Fixed issue #1 where the action attribute was not be read from the reference form element.

## [0.1.2] - 2021-08-16

### Added

- This CHANGELOG file to track all the changes
- Initial real tests

### Changed

- Allows field names that end on`[]` to be included in the `defaults` object without the brackets

### Fixed

- Fixed issue with missing ES module files missing from the release

## [0.1.1] - 2021-08-15

### Fixed

- TS export config error

## [0.1.0] - 2021-08-15

### Added

- The `InForm` React component
- The `useform` React hook

[Unreleased]: https://github.com/ptejada/in-form/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/ptejada/in-form/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/ptejada/in-form/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ptejada/in-form/releases/tag/v0.1.0
