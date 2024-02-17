import Typography from "@mui/material/Typography";
import RAppBar from './NavBar.jsx';

export const PageLayout = (props) => {
    return (
        <>
            <RAppBar />
            <br />
            {/* <Typography variant="h5">
                <center>iGrafx Display Dashboard</center>
            </Typography> */}
            <br />
            {props.children}
        </>
    );
};