
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Player, Team } from '@/types/player';
import { getPositionLabel } from '@/utils/positionUtils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ExportButtonProps {
  players: Player[];
  teams: Team[];
}

const ExportButton = ({ players, teams }: ExportButtonProps) => {
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = 40;

      // Função para adicionar nova página se necessário
      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - 30) {
          doc.addPage();
          yPosition = 40;
          return true;
        }
        return false;
      };

      // Header com gradiente simulado
      doc.setFillColor(34, 197, 94); // green-500
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      doc.setFillColor(59, 130, 246); // blue-500
      doc.rect(pageWidth * 0.7, 0, pageWidth * 0.3, 25, 'F');

      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('TimeFacil', margin, 18);
      
      // Subtítulo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatorio de Times e Jogadores', pageWidth - margin, 18, { align: 'right' });
      
      // Data
      doc.setTextColor(107, 114, 128); // gray-500
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth - margin, yPosition, { align: 'right' });
      
      yPosition += 25;

      // Seção de jogadores
      if (players.length > 0) {
        checkPageBreak(30);
        
        // Card background para seção de jogadores
        doc.setFillColor(249, 250, 251); // gray-50
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'FD');
        
        doc.setTextColor(17, 24, 39); // gray-900
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('JOGADORES CADASTRADOS', margin + 10, yPosition + 13);
        
        doc.setTextColor(107, 114, 128); // gray-500
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total: ${players.length} jogadores`, pageWidth - margin - 10, yPosition + 13, { align: 'right' });
        
        yPosition += 35;

        // Agrupar jogadores por posição
        const playersByPosition = players.reduce((acc, player) => {
          if (!acc[player.position]) {
            acc[player.position] = [];
          }
          acc[player.position].push(player);
          return acc;
        }, {} as Record<string, Player[]>);

        // Cores para cada posição
        const positionColors = {
          'goleiro': [59, 130, 246], // blue-500
          'zagueiro': [34, 197, 94], // green-500
          'ala-esquerda': [234, 179, 8], // yellow-500
          'ala-direita': [234, 179, 8], // yellow-500
          'atacante': [239, 68, 68], // red-500
          'so-linha': [107, 114, 128] // gray-500
        };

        Object.entries(playersByPosition).forEach(([position, positionPlayers]) => {
          checkPageBreak(40);

          // Header da posição com cor
          const color = positionColors[position as keyof typeof positionColors] || [107, 114, 128];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${getPositionLabel(position as any)} (${positionPlayers.length})`, margin + 8, yPosition + 8);
          
          yPosition += 18;

          // Lista de jogadores
          positionPlayers.forEach((player, index) => {
            checkPageBreak(8);
            
            // Linha alternada
            if (index % 2 === 0) {
              doc.setFillColor(249, 250, 251); // gray-50
              doc.rect(margin + 5, yPosition - 3, pageWidth - 2 * margin - 10, 8, 'F');
            }
            
            doc.setTextColor(55, 65, 81); // gray-700
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${index + 1}.`, margin + 10, yPosition + 2);
            doc.text(player.name, margin + 20, yPosition + 2);
            
            yPosition += 8;
          });
          yPosition += 8;
        });
      }

      // Seção de times
      if (teams.length > 0) {
        checkPageBreak(40);
        
        // Card background para seção de times
        doc.setFillColor(254, 249, 195); // yellow-50
        doc.setDrawColor(251, 191, 36); // yellow-400
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'FD');
        
        doc.setTextColor(17, 24, 39); // gray-900
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('TIMES SORTEADOS', margin + 10, yPosition + 13);
        
        yPosition += 35;

        const regularTeams = teams.filter(team => !team.isReserve);
        const reserveTeam = teams.find(team => team.isReserve);

        regularTeams.forEach((team, teamIndex) => {
          checkPageBreak(50);

          // Header do time
          doc.setFillColor(59, 130, 246); // blue-500
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`TIME ${team.id}`, margin + 10, yPosition + 10);
          
          doc.setFontSize(10);
          doc.text(`${team.players.length} jogadores`, pageWidth - margin - 10, yPosition + 10, { align: 'right' });
          
          yPosition += 22;

          // Jogadores do time
          team.players.forEach((player, playerIndex) => {
            checkPageBreak(8);
            
            // Linha alternada
            if (playerIndex % 2 === 0) {
              doc.setFillColor(248, 250, 252); // slate-50
              doc.rect(margin + 5, yPosition - 3, pageWidth - 2 * margin - 10, 8, 'F');
            }
            
            doc.setTextColor(55, 65, 81); // gray-700
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${playerIndex + 1}.`, margin + 10, yPosition + 2);
            doc.text(`${player.name}`, margin + 20, yPosition + 2);
            doc.setTextColor(107, 114, 128); // gray-500
            doc.text(getPositionLabel(player.position), pageWidth - margin - 10, yPosition + 2, { align: 'right' });
            
            yPosition += 8;
          });
          yPosition += 15;
        });

        // Time reserva
        if (reserveTeam && reserveTeam.players.length > 0) {
          checkPageBreak(40);

          // Header do time reserva
          doc.setFillColor(251, 146, 60); // orange-400
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('TIME RESERVA', margin + 10, yPosition + 10);
          
          doc.setFontSize(10);
          doc.text(`${reserveTeam.players.length} jogadores`, pageWidth - margin - 10, yPosition + 10, { align: 'right' });
          
          yPosition += 22;

          reserveTeam.players.forEach((player, playerIndex) => {
            checkPageBreak(8);
            
            if (playerIndex % 2 === 0) {
              doc.setFillColor(255, 247, 237); // orange-50
              doc.rect(margin + 5, yPosition - 3, pageWidth - 2 * margin - 10, 8, 'F');
            }
            
            doc.setTextColor(55, 65, 81); // gray-700
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${playerIndex + 1}.`, margin + 10, yPosition + 2);
            doc.text(`${player.name}`, margin + 20, yPosition + 2);
            doc.setTextColor(107, 114, 128); // gray-500
            doc.text(getPositionLabel(player.position), pageWidth - margin - 10, yPosition + 2, { align: 'right' });
            
            yPosition += 8;
          });
        }
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(243, 244, 246); // gray-100
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        doc.setTextColor(107, 114, 128); // gray-500
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('TimeFacil - Sistema de Sorteio de Times', margin, pageHeight - 5);
        doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      }

      // Salvar o PDF
      const fileName = `timefacil-relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    }
  };

  const hasData = players.length > 0 || teams.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <Button
      onClick={exportToPDF}
      variant="outline"
      className="flex w-full items-center justify-center gap-2 bg-card transition-all hover:shadow-md sm:w-auto"
    >
      <FileDown className="w-4 h-4" />
      Exportar PDF
    </Button>
  );
};

export default ExportButton;
