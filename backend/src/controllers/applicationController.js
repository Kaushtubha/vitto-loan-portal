const prisma = require('../config/db');

// @desc    Submit a new loan application
// @route   POST /api/applications
// @access  Public
exports.createApplication = async (req, res, next) => {
  try {
    const { applicant_name, mobile_number, loan_amount, loan_purpose, preferred_language } = req.body;

    const application = await prisma.application.create({
      data: {
        applicant_name,
        mobile_number,
        loan_amount,
        loan_purpose,
        preferred_language,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all loan applications
// @route   GET /api/applications
// @access  Public
exports.getApplications = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    // Filter by status (pending, approved, rejected)
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    // Search by applicant name or mobile number
    if (search) {
      where.OR = [
        { applicant_name: { contains: search, mode: 'insensitive' } },
        { mobile_number: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.application.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update the status of an application
// @route   PATCH /api/applications/:id/status
// @access  Public
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    // Check if Prisma error is for record not found
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Loan application not found',
        },
      });
    }
    next(error);
  }
};

// @desc    Get dashboard metrics and analytics
// @route   GET /api/summary
// @access  Public
exports.getSummary = async (req, res, next) => {
  try {
    // 1. Total applications count
    const totalApplications = await prisma.application.count();

    // 2. Total loan amount requested (Prisma returns Decimal which needs conversion/fallback)
    const amountSum = await prisma.application.aggregate({
      _sum: {
        loan_amount: true,
      },
    });
    const totalAmount = parseFloat(amountSum._sum.loan_amount || 0);

    // 3. Status breakdown
    const groupStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    groupStatus.forEach((group) => {
      statusCounts[group.status] = group._count.id;
    });

    // 4. Extra analytics for a wow-factor premium dashboard:
    // Approved loan volume
    const approvedSum = await prisma.application.aggregate({
      where: { status: 'approved' },
      _sum: {
        loan_amount: true,
      },
    });
    const approvedAmount = parseFloat(approvedSum._sum.loan_amount || 0);

    // Language preferences breakdown
    const groupLanguage = await prisma.application.groupBy({
      by: ['preferred_language'],
      _count: {
        id: true,
      },
    });

    const languageDistribution = groupLanguage.map((item) => ({
      name: item.preferred_language,
      value: item._count.id,
    }));

    // 5. Recent trends (mock or group by day, let's group by day of the week or date for chart)
    const recentApplications = await prisma.application.findMany({
      orderBy: { created_at: 'desc' },
      take: 20,
      select: {
        created_at: true,
        loan_amount: true,
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        totalAmount,
        approvedAmount,
        statusCounts,
        languageDistribution,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
