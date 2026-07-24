import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        if (token) {

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } else {

            navigate("/");

        }

    }, [navigate, searchParams]);

    return (
        <h2
            style={{
                textAlign: "center",
                marginTop: "100px"
            }}
        >
            Signing you in...
        </h2>
    );

}

export default OAuthSuccess;