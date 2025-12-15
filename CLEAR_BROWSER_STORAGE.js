// Clear All User Data Script
// Copy this code and run it in your browser's Console (F12)

console.log('🗑️ Clearing all user data...');

// Clear localStorage
localStorage.removeItem('pharma_users');
localStorage.removeItem('pharma_current_user');

// Clear all localStorage (full reset)
localStorage.clear();

// Clear sessionStorage too
sessionStorage.clear();

console.log('✅ All browser storage cleared!');
console.log('📋 Now refresh the page (F5) and try signing up again.');
