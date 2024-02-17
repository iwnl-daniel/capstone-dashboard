import * as React from 'react';
import { Link as RouterLink } from "react-router-dom";
// import image from '../../public/404.gif';
import { Button, Typography } from "@mui/material";



export default function NotFound() {
    return (
        <div>

            <Typography variant="h3">Oops! This page doesn't exist yet... </Typography>
            <Button variant="contained" color="secondary" component={RouterLink} to="/">Home</Button>
        
            {/* <img bottom="0px" src={image}></img>  */}
        </div>
    )
}