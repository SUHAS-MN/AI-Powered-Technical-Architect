import fetch from 'node-fetch';

async function run() {
    const baseUrl = 'http://localhost:8000/api';
    
    try {
        console.log("=== 1. Register / Login ===");
        let res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_dev@example.com', password: 'password123' })
        });
        
        let data = await res.json();
        
        if (!data.success) {
            console.log("User might not exist, registering...");
            res = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Test Dev', email: 'test_dev@example.com', password: 'password123' })
            });
            data = await res.json();
            console.log("Register response:", data.success ? "Success" : data);
            
            res = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test_dev@example.com', password: 'password123' })
            });
            data = await res.json();
        }
        
        console.log("Login success:", data.success);
        if (!data.success) {
            console.error(data);
            return;
        }

        const token = data.data.accessToken;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        console.log("\n=== 2. Create Project PRD ===");
        res = await fetch(`${baseUrl}/generate/prd`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ projectName: 'Test Quantum Project', prompt: 'Build a distributed AI agent framework.' })
        });
        data = await res.json();
        console.log("PRD Creation:", data.success ? "Success" : data);
        
        const projectId = data.data?._id;
        console.log("Generated Project ID:", projectId);
        
        if (projectId) {
            console.log("\n=== 3. Generate Tech Blueprint ===");
            console.log("Sending request to /generate/tech (this might take a few seconds)...");
            res = await fetch(`${baseUrl}/generate/tech`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ id: projectId })
            });
            data = await res.json();
            console.log("Tech Blueprint Generation:", data.success ? "Success" : data);
            if (data.success) {
                console.log("Keys generated:", Object.keys(data.data));
                console.log("Has schema:", !!data.data.schema_json);
                console.log("Has API:", !!data.data.api_json);
            } else {
                console.log(data);
            }
        }

        console.log("\n=== 4. Logout ===");
        res = await fetch(`${baseUrl}/auth/logout`, {
            method: 'POST',
            headers
        });
        data = await res.json();
        console.log("Logout response:", data.success ? "Success" : data);

    } catch (err) {
        console.error("Test failed with error:", err);
    }
}

run();
