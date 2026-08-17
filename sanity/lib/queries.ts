import { groq } from 'next-sanity';

// All Employees Query
export const EMPLOYEES_QUERY = groq`
  *[_type == "employee"] | order(employeeId asc) {
    _id,
    "id": _id,
    employeeId,
    firstName,
    lastName,
    email,
    phone,
    department,
    jobTitle,
    employmentType,
    joiningDate,
    joiningDateIso,
    manager,
    location,
    status,
    salary,
    bankName,
    accountNumber,
    emergencyContact,
    emergencyPhone,
    "avatarUrl": avatarImage.asset->url
  }
`;

// Single Employee Query by ID
export const EMPLOYEE_BY_ID_QUERY = groq`
  *[_type == "employee" && _id == $id][0] {
    _id,
    "id": _id,
    employeeId,
    firstName,
    lastName,
    email,
    phone,
    department,
    jobTitle,
    employmentType,
    joiningDate,
    joiningDateIso,
    manager,
    location,
    status,
    salary,
    bankName,
    accountNumber,
    emergencyContact,
    emergencyPhone,
    "avatarUrl": avatarImage.asset->url
  }
`;

// Special Events Query
export const SPECIAL_EVENTS_QUERY = groq`
  *[_type == "specialEvent"] | order(date asc) {
    _id,
    "id": _id,
    title,
    type,
    date,
    employeeName,
    "employeeId": employee._ref,
    years,
    description
  }
`;

// WFH Requests Query
export const WFH_REQUESTS_QUERY = groq`
  *[_type == "wfhRequest"] | order(requestDate desc) {
    _id,
    "id": _id,
    "employeeId": employee._ref,
    employeeName,
    department,
    requestDate,
    startDate,
    endDate,
    displayDateRange,
    reason,
    status,
    approvedBy,
    reviewedAt
  }
`;

// Payroll Records Query
export const PAYROLL_RECORDS_QUERY = groq`
  *[_type == "payroll"] | order(employeeId asc) {
    _id,
    "id": _id,
    "employeeId": employeeId,
    employeeName,
    department,
    jobTitle,
    basicSalary,
    housingAllowance,
    transportAllowance,
    otherAllowance,
    grossSalary,
    deductions,
    netSalary,
    status,
    paymentDate
  }
`;

// Current Users Query
export const CURRENT_USERS_QUERY = groq`
  *[_type == "currentUser"] {
    _id,
    "id": _id,
    name,
    email,
    role,
    "avatar": avatar.asset->url,
    employeeId,
    department,
    title,
    phone,
    location
  }
`;
