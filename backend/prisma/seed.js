const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing records...');
  await prisma.application.deleteMany();

  console.log('Seeding database with mock applications...');

  const mockApplications = [
    {
      applicant_name: 'Rajesh Kumar',
      mobile_number: '9876543210',
      loan_amount: 150000.00,
      loan_purpose: 'Expanding inventory for local neighborhood grocery shop (Kirana Store)',
      preferred_language: 'Hindi',
      status: 'approved',
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
    {
      applicant_name: 'Kavitha Reddy',
      mobile_number: '8123456789',
      loan_amount: 500000.00,
      loan_purpose: 'Paying tuition fees for daughter\'s higher studies in engineering',
      preferred_language: 'Telugu',
      status: 'pending',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      applicant_name: 'Amit Patil',
      mobile_number: '7765432109',
      loan_amount: 45000.00,
      loan_purpose: 'Purchase of seeds, fertilizers, and repair of water pump for agriculture',
      preferred_language: 'Marathi',
      status: 'approved',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      applicant_name: 'Priya Sharma',
      mobile_number: '9988776655',
      loan_amount: 1200000.00,
      loan_purpose: 'Emergency medical operation and hospitalization coverage for father',
      preferred_language: 'English',
      status: 'rejected',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      applicant_name: 'Senthil Loganathan',
      mobile_number: '9001234567',
      loan_amount: 85000.00,
      loan_purpose: 'Buying a commercial sewing machine and styling materials for boutique shop',
      preferred_language: 'Tamil',
      status: 'pending',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      applicant_name: 'Anjali Desai',
      mobile_number: '8899001122',
      loan_amount: 250000.00,
      loan_purpose: 'Renovating home kitchen and leaking roof repairs before monsoon season',
      preferred_language: 'Hindi',
      status: 'pending',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      applicant_name: 'Vikramjit Singh',
      mobile_number: '7654321098',
      loan_amount: 95000.00,
      loan_purpose: 'Working capital to buy laptop and equipment for freelance design agency',
      preferred_language: 'English',
      status: 'pending',
      created_at: new Date(), // Just now
    }
  ];

  for (const app of mockApplications) {
    await prisma.application.create({
      data: app
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
