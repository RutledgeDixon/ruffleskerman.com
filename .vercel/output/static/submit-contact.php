<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_log("Contact submission PHP script called");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    error_log("Received data: " . json_encode($data));
    
    // Check if this is planner data
    if (isset($data['userData'])) {
        // Handle planner save
        $newData = $data['userData'];
        $filePath = __DIR__ . '/../src/lib/plannerUsers.json';
        
        // Read full data
        $fullData = json_decode(file_get_contents($filePath), true);
        
        // Find and update user
        $userIndex = -1;
        foreach ($fullData['users'] as $index => $user) {
            if ($user['name'] === $newData['name']) {
                $userIndex = $index;
                break;
            }
        }
        
        if ($userIndex !== -1) {
            $fullData['users'][$userIndex] = $newData;
            file_put_contents($filePath, json_encode($fullData, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'message' => 'User updated']);
        } else {
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
        exit;
    }
    
    // Handle contact form data
    if (empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: name, email, and phone are required']);
        exit;
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }
    
    // Generate unique filename
    $timestamp = date('Ymd-His');
    $randomId = substr(md5(uniqid(mt_rand(), true)), 0, 8);
    $filename = "contact-{$timestamp}-{$randomId}.json";
    
    // Prepare data to save
    $contactData = [
        'id' => $randomId,
        'name' => trim($data['name']),
        'email' => trim(strtolower($data['email'])),
        'phone' => trim($data['phone']),
        'company' => isset($data['company']) ? trim($data['company']) : '',
        'message' => isset($data['message']) ? trim($data['message']) : '',
        'verificationMethod' => $data['verificationMethod'] ?? 'unknown',
        'submittedAt' => date('c'),
        'ipAddress' => $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    // Create secure data directory outside public_html
    $dataDir = __DIR__ . '/../contact-submissions';
    error_log("__DIR__: " . __DIR__);
    error_log("Attempting secure data dir: $dataDir");
    
    if (!is_dir($dataDir)) {
        if (!mkdir($dataDir, 0755, true)) {
            error_log("Failed to create secure dir, using fallback");
            // Fallback to local data folder
            $dataDir = __DIR__ . '/data/contact-submissions';
            error_log("Fallback data dir: $dataDir");
            if (!is_dir($dataDir)) {
                if (!mkdir($dataDir, 0755, true)) {
                    error_log("Failed to create fallback dir");
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to create data directory']);
                    exit;
                }
            }
        }
    }
    
    error_log("Using data dir: $dataDir");
    
    // Save to JSON file
    $filePath = $dataDir . '/' . $filename;
    if (file_put_contents($filePath, json_encode($contactData, JSON_PRETTY_PRINT)) === false) {
        error_log("Failed to write file: $filePath");
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save submission']);
        exit;
    }
    
    error_log("Successfully saved to: $filePath");
    
    echo json_encode([
        'success' => true,
        'message' => 'Contact information saved successfully',
        'id' => $randomId,
        'path' => $dataDir
    ]);
    
} catch (Exception $e) {
    error_log('Error processing contact form: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>