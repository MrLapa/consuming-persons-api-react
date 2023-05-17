import React from "react";

import classes from "./Person.module.css";

const Person = (props) => {
  const { name, phone, address } = props;
  const { street, city } = address;

  return (
    <li className={classes.person}>
      <h2>{name}</h2>
      <h3>{phone}</h3>
      <p>{street}</p>
      <p>{city}</p>
    </li>
  );
};

export default Person;
