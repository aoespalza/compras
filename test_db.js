const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/procura?schema=procura'
    }
  }
});

async function test() {
  console.log('Conectando a la base de datos...');
  
  const users = await prisma.user.findMany();
  console.log('Usuarios en la base de datos:', users);
  
  if (users.length > 0) {
    const user = users[0];
    console.log('Usuario encontrado:', user.username);
    console.log('Hash en BD:', user.password);
    
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('Contraseña válida:', isValid);
  }
  
  await prisma.$disconnect();
}

test().catch(console.error);
