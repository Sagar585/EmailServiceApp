import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function OnBoard() {
  const [projectName, setProjectName] = useState("");
  const [password, setPassword] = useState("");
  const [Repassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const collectData = async (e) => {
    // if (password === Repassword) {
    //   setRePassword(e.target.value)
    // }
    // alert("Password does not match");

  e.preventDefault();
  const data = {
    projectName,
    password,
  };

  try {
    const response = await fetch("http://localhost:2000/onBoarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result.message);
        navigate("/login");
    } else {
      const errorText = await response.text();
      console.error("Error:", response.statusText, errorText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const mystyle = {
  margin: "0px 26px",
};
return (

  <div className="flex items-center justify-center min-h-screen">
    <Card className="mx-auto max-w-sm" style={mystyle} >
      <CardHeader>
        <CardTitle className="text-2xl">OnBoard</CardTitle>
        <CardDescription>
          Enter your details below to Onboard to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={collectData}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                type="text"
                placeholder="your project name ..."
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center">
                <Label htmlFor="password">Re Enter Password</Label>
              </div>
              <Input
                id="Repassword"
                type="password"
                required
                value={Repassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              OnBoard
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already Have OnBoarded ?{" "}
            <Link to="/signUp" className="underline">
              Login Here
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  </div>
);
}
