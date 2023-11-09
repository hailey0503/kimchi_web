import React, { useEffect, useState } from "react";
import styles from "../styles/card.module.css";
import Image from "next/image";
import {version, exchanges} from 'ccxt';



const Table =() =>{
	console.log(version, Object.keys(exchanges));

	return (
		<div></div>
	)

}
export default Table;