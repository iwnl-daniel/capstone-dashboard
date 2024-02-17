import Typography from "@mui/material/Typography";
// import Dashboard from "../test/Dashboard_Test"
// 1. import template for authenticated and non-authenticated users.
import TodoDisplay from "../components/TodoList/TodoDisplay";



// 2. Insert the tags and customize the appearance to suit needs based on auth status.
export const TodoTest = () => {
    return (
        <>
                <Typography variant="h3">Testpage for the Todo List.</Typography>
                <TodoDisplay />
        </>
    );
}