import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import "./EmailList.css";

export default function EmailList() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [expandedEmailId, setExpandedEmailId] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:2000/getEmail", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setEmails(result);
        } else {
          const errorText = await response.text();
          console.error("Error:", response.statusText, errorText);
          setError(errorText);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        setError(error.message);
      }
    };

    fetchEmails();
  }, []);

  const handleDelete = async (emailId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch('http://localhost:2000/deleteEmail', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ emailId }),
      });

      if (response.ok) {
        // Update the email list by removing the deleted email
        setEmails((prevEmails) => prevEmails.filter(email => email._id !== emailId));
      } else {
        const errorText = await response.text();
        console.error("Error:", response.statusText, errorText);
        setError(errorText);
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      setError(error.message);
    }
  };

  const toggleExpand = (emailId) => {
    setExpandedEmailId(expandedEmailId === emailId ? null : emailId);
  };

  if (error) {
    return <div>Error fetching emails: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-3xl font-bold mb-4">Email List</h1>
      <div className="flex flex-wrap-reverse gap-4 w-full">
        {emails.map((email) => (
          <div key={email._id} className="flex-shrink-0 w-full">
            <Card className="shadow-lg flex flex-col h-full">
              <button
                onClick={() => handleDelete(email._id)}
                className="delete"
              >
                Delete
              </button>
              <CardHeader className={`pt-0`}>
                <CardTitle>{email.subject}</CardTitle>
              </CardHeader>
              <CardContent className={`flex-1 overflow-hidden ${expandedEmailId === email._id ? '' : 'max-h-20'}`}>
                <p><strong>From:</strong> {email.fromEmail}</p>
                <button
                  className="bg-blue-500 text-white p-2 m-2 rounded"
                  onClick={() => toggleExpand(email._id)}
                >
                  {expandedEmailId === email._id ? "Show Less" : "Show More"}
                </button>
                <p><strong>To:</strong> {email.to.join(", ")}</p>
                {email.cc && email.cc.length > 0 && <p><strong>CC:</strong> {email.cc.join(", ")}</p>}
                {email.bcc && email.bcc.length > 0 && <p><strong>BCC:</strong> {email.bcc.join(", ")}</p>}
                {email.subject && <p><strong>Subject:</strong> {email.subject}</p>}
                <p className="mt-2"><strong>Body:</strong></p>
                <p>{email.body}</p>
              </CardContent>
              
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
