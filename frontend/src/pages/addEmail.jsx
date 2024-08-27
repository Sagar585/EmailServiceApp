import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

export default function AddEmail() {
    const [emailData, setEmailData] = useState({
        fromEmail: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
    });

    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData({
            ...emailData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:2000/addEmail", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(emailData),
            });

            if (response.ok) {
                alert("Email added successfully");
                setEmailData({
                    fromEmail: '',
                    to: '',
                    cc: '',
                    bcc: '',
                    subject: '',
                    body: '',
                });
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Error adding email');
            }
        } catch (error) {
            console.error('Error adding email:', error);
            alert('Error adding email');
        }
    };

    return (
        <div className="flex justify-center mt-8">
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle>Add New Email</CardTitle>
                    <CardDescription>Fill out the form below to add a new email</CardDescription>
                </CardHeader>
                <CardContent>
                    <form style={{"color" : 'white'}} onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block ">From Email:</label>
                            <input
                                type="email"
                                name="fromEmail"
                                value={emailData.fromEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-gray-900 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block ">To:</label>
                            <input
                                type="email"
                                name="to"
                                value={emailData.to}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border text-gray-900 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block ">CC:</label>
                            <input
                                type="email"
                                name="cc"
                                value={emailData.cc}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-gray-900 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block ">BCC:</label>
                            <input
                                type="email"
                                name="bcc"
                                value={emailData.bcc}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-gray-900 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block ">Subject:</label>
                            <input
                                type="text"
                                name="subject"
                                value={emailData.subject}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-gray-900 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block ">Body:</label>
                            <textarea
                                name="body"
                                value={emailData.body}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-gray-900 border rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Email</button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <p>Ensure all details are correct before submitting</p>
                </CardFooter>
            </Card>
        </div>
    );
}
