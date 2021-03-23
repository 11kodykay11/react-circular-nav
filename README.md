# react-circular-nav

> Library for creating circular or semi circular navigation

[![NPM](https://img.shields.io/npm/v/react-circular-nav.svg)](https://www.npmjs.com/package/react-circular-nav) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-circular-nav
```

## Usage

```tsx
import React, { Component } from "react";
import Navigation from "react-circular-nav";
import "react-circular-nav/dist/index.css";

class Example extends Component {
	render() {
		return <Navigation />;
	}
}
```

## Properties

| Name        | Type                | Example                                |
| ----------- | ------------------- | -------------------------------------- |
| steps       | Array []            | ["string", 1000, "some more", 1000]    |
| loop        | number              | 5, 10, Infinity etc.                   |
| blinkCursor | boolean             | true (default)                         |
| editDelay   | number              | 60 (default)                           |
| deleteDelay | number              | 60 (default)                           |
| style       | react native styles | `{[styles.text, {fontSize: 50}]}` etc. |

---

## License

MIT © [11kodykay11](https://github.com/11kodykay11)
