import Job from '../models/Job.js';
import { ROLES, JOB_STATUS } from '../utils/constants.js';
import { createNotification, notifyRole } from './notificationController.js';

// @desc    Create a new job post
// @route   POST /api/jobs
// @access  Private (Alumni)
export const createJob = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === ROLES.ADMIN;
        const jobData = {
            ...req.body,
            postedBy: req.user._id,
            isApproved: isAdmin, // auto-approve if admin posts
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            message: isAdmin ? 'Job posted and published!' : 'Job posted successfully. Pending admin approval.',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a job post
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res, next) => {
    try {
        const { status, jobType, skills, page = 1, limit = 20 } = req.query;

        const query = {};

        // Only show approved jobs to non-admins
        if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.COORDINATOR) {
            query.isApproved = true;
            query.status = JOB_STATUS.OPEN;
        }

        if (status) {
            query.status = status;
        }

        if (req.query.isApproved !== undefined) {
            query.isApproved = req.query.isApproved === 'true';
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (skills) {
            const skillsArray = Array.isArray(skills) ? skills : [skills];
            query.skills = { $in: skillsArray };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Job.countDocuments(query);

        const jobs = await Job.find(query)
            .populate('postedBy', 'email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                jobs,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'email')
            .populate('approvedBy', 'email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student)
export const applyForJob = async (req, res, next) => {
    try {
        const { resume, coverLetter } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (!job.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Job is not approved yet',
            });
        }

        if (job.status === JOB_STATUS.CLOSED) {
            return res.status(400).json({
                success: false,
                message: 'Job applications are closed',
            });
        }

        // Check if already applied
        const alreadyApplied = job.applications.some(
            (app) => app.studentId.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job',
            });
        }

        job.applications.push({
            studentId: req.user._id,
            resume,
            coverLetter,
        });

        await job.save();

        res.json({
            success: true,
            message: 'Application submitted successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/jobs/:jobId/applications/:appId
// @access  Private (Alumni - job poster, Admin)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.ADMIN &&
            req.user._id.toString() !== job.postedBy.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update applications',
            });
        }

        const application = job.applications.id(req.params.appId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        application.status = status;
        await job.save();

        res.json({
            success: true,
            message: 'Application status updated',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve job post
// @route   PUT /api/jobs/:id/approve
// @access  Private (Admin)
export const approveJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        job.isApproved = true;
        job.approvedBy = req.user._id;
        await job.save();

        // Notify the job poster
        await createNotification(
            job.postedBy,
            'Job Posting Approved! ✅',
            `Your job posting "${job.title}" at ${job.company} has been approved and is now live.`,
            'job'
        );

        // Notify all students about the new job
        notifyRole('Student', 'New Job Opportunity! 💼',
            `"${job.title}" at ${job.company} (${job.location}) is now open for applications.`,
            'job'
        );

        res.json({
            success: true,
            message: 'Job approved successfully',
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's applications
// @route   GET /api/jobs/my-applications
// @access  Private (Student)
export const getMyApplications = async (req, res, next) => {
    try {
        const jobs = await Job.find({
            'applications.studentId': req.user._id,
        })
            .populate('postedBy', 'email')
            .select('title company location jobType applications');

        // Filter to show only current user's applications
        const myApplications = jobs.map((job) => {
            const application = job.applications.find(
                (app) => app.studentId.toString() === req.user._id.toString()
            );

            return {
                job: {
                    id: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    jobType: job.jobType,
                },
                application,
            };
        });

        res.json({
            success: true,
            data: myApplications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject job post (Admin only)
// @route   PUT /api/jobs/:id/reject
// @access  Private (Admin)
export const rejectJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.json({
            success: true,
            message: 'Job rejected and removed',
        });
    } catch (error) {
        next(error);
    }
};
