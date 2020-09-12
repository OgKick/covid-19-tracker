import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, active, isRed, total, ...props }) {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        {/*Title i.e. ConornaViurs cases*/}
        <Typography className="infoBox_title" color="textSecondary">
          {title}
        </Typography>
        {/*Cases i.e.  cases*/}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        {/*Total i.e. Total cases*/}
        <Typography className="infoBox_total" color="textSecondary">
          <p>{total} Total</p>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
