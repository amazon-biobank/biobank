import React, { Component } from 'react';

import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	}
});

export class Container extends Component {
	render() {
		const { classes, children } = this.props;
		return (
			<div className={classes.root}>
				{children}
			</div>
		);
	}
}

export default compose(withStyles(styles))(Container);
