// compares two assignments with each other
// used in setStatus() to remove duplicates
function compareAssignment(a1, a2) {
    if (a1.name !== a2.name) return false;
    if (a1.status !== a2.status) return false;
    if (a1.deadline !== a2.deadline) return false;
    return true;
}