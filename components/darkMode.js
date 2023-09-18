import React, { useContext } from 'react';
import { ThemeContext } from '../darkModeContext.js';
import styles from '../styles/darkMode.module.css';

const darkMode =() => {

	const {toggle, mode} = useContext(ThemeContext)
	return (
		<div className={styles.container} onClick={toggle}>
			<div className={styles.icon}>🌙</div>
			<div className={styles.icon}>☀️</div>
			<div className={styles.ball} 
			style={mode === "light"? {left: "2px"} : {right: "2px"}} ></div>
		</div>
		
	)
	
}

export default darkMode