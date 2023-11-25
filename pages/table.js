import React, { useState, useEffect } from "react";
import axios from "axios";

import Table from "../components/Table";
import LongShort from "../components/LongShort";
import ChartComp from "../components/Chart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";


const tablepage= () => {
	return (
		<>
		 <div >
        <Header />
      </div>
		<div >
		<Table />
	   </div>
	   <Footer/>
	   </>
	)
}
export default tablepage;