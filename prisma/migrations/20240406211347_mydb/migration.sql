-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaSenha" (
    "id" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,

    CONSTRAINT "DiaSenha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiaSenha" ADD CONSTRAINT "DiaSenha_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
