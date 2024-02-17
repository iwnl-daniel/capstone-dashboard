import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from "@mui/icons-material/Work";
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useMsal} from "@azure/msal-react";
import {useState, useEffect} from "react";

/**
 * ProfileData contains the functions required to pull the EU's information from the SSO portal and display them on the profile page.
 * @constant GetName
 * @constant GetEmail
 * @constant ProfileData
 * @
 * @returns {*}
 */

export const GetName = () => {
    const { instance } = useMsal();
    const [name, setName] =  useState('');

    useEffect(() => {
        const currAccount = instance.getActiveAccount();
        if(currAccount) {
            setName(currAccount.name)
        }
    }, [instance]);
    return name;
};

export const GetEmail = () => {
    const { instance } = useMsal();
    const [username, setEmail] =  useState('');

    useEffect(() => {
        const currAccount = instance.getActiveAccount();
        if(currAccount) {
            setEmail(currAccount.username)
        }
    }, [instance]);
    return username;
};


export const ProfileData = ({ graphData }) => {
    return (
        <List className="profileData">
            <NameListItem name={<GetName />} />
            <MailListItem mail={<GetEmail />} />
        </List>
        
    );
};

const NameListItem = ({ name }) => (
    <ListItem>
        <ListItemAvatar>
            <Avatar>
                <PersonIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Name" secondary={name} />
        
    </ListItem>
);

const MailListItem = ({ mail }) => (
    <ListItem>
        <ListItemAvatar>
            <Avatar>
                <MailIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Mail" secondary={mail} />
    </ListItem>
);
