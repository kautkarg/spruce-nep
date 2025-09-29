# Next.js Frontend for Spruce Lifeskills

This is a Next.js application that serves as the user-facing frontend for Spruce Lifeskills. It is designed to connect to a separate backend server for handling the general inquiry form.

This guide will walk you, the backend developer, through the process of connecting your PHP server to this frontend.

## Your Goal: Build a Backend for the Inquiry Form

The frontend has a **General Inquiry Form** on the homepage. Your task is to create a single API endpoint on your PHP server that can receive data from this form.

---

### Step 1: Create the PHP Endpoint

On your server, create a PHP file to handle this. For example, you could name it `inquiries.php`. This file will be your API endpoint.

### Step 2: Write the PHP Code

Here is a secure, production-ready PHP script to get you started. Copy this into your `inquiries.php` file. The comments will explain what each part does.

```php
<?php
// --- CONFIGURATION ---
// IMPORTANT: In production, replace '*' with your frontend's actual domain
// Example: header("Access-Control-Allow-Origin: https://www.your-app-domain.com");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// --- SCRIPT LOGIC ---

// 1. Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 2. Get the incoming JSON data from the frontend
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    // 3. Validate the received data
    if (
        $data &&
        !empty($data['name']) &&
        !empty($data['phone']) &&
        !empty($data['course'])
    ) {
        // 4. Sanitize the data to prevent security issues
        $name = htmlspecialchars(strip_tags($data['name']));
        $phone = htmlspecialchars(strip_tags($data['phone']));
        $course = htmlspecialchars(strip_tags($data['course']));
        // Message is optional, handle it safely if it exists
        $message = isset($data['message']) ? htmlspecialchars(strip_tags($data['message'])) : '';

        // --- YOUR CUSTOM BACKEND LOGIC GOES HERE ---
        // This is where you would save the sanitized data to your database.
        // For example:
        // $db = new mysqli(...);
        // $stmt = $db->prepare("INSERT INTO inquiries (name, phone, course, message) VALUES (?, ?, ?, ?)");
        // $stmt->bind_param("ssss", $name, $phone, $course, $message);
        // $stmt->execute();
        // $stmt->close();
        // $db->close();
        // --- END OF YOUR LOGIC ---

        // 5. Send a success response back to the frontend
        http_response_code(200);
        echo json_encode(["message" => "Thank you for your inquiry! Our team will call you back shortly."]);

    } else {
        // If data is missing or invalid
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data. Please fill out all required fields."]);
    }
} else {
    // If the request method is not POST
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed."]);
}
?>
```

### Step 3: Update the Frontend

Once your endpoint is live (e.g., at `https://your-backend-api.com/inquiries.php`), you need to tell the frontend where to send the data.

*   **File to Edit:** `src/app/actions.ts`
*   **Line to Change:** Find the `fetch` URL inside the `submitInquiry` function.
*   **Change this:** `const response = await fetch("https://your-backend-api.com/inquiries", ...)`
*   **To this:** `const response = await fetch("https://your-backend-api.com/inquiries.php", ...)` (or your actual URL)

This setup provides a clean separation between the frontend and your custom backend, giving you the flexibility to build and deploy the server independently.
