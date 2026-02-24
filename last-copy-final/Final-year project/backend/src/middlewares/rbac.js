import { ROLES } from '../utils/constants.js';

// Check if user has required role
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
            });
        }

        next();
    };
};

// Check if user is admin
export const isAdmin = authorize(ROLES.ADMIN);

// Check if user is alumni
export const isAlumni = authorize(ROLES.ALUMNI);

// Check if user is student
export const isStudent = authorize(ROLES.STUDENT);

// Check if user is coordinator
export const isCoordinator = authorize(ROLES.COORDINATOR);

// Check if user is admin or coordinator
export const isAdminOrCoordinator = authorize(ROLES.ADMIN, ROLES.COORDINATOR);

// Check if user is alumni or student
export const isAlumniOrStudent = authorize(ROLES.ALUMNI, ROLES.STUDENT);
