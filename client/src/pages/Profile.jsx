import { ProfileData } from "../components/ProfileData.jsx";

export const Profile = () => {
    return (
        <>
            <ProfileData graphData={{
                displayName: 'Dummy Joe',
                mail: 'dummy@mail.com',
            }} />
        </>
    )
}
