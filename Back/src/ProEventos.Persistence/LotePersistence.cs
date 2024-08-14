using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contextos;


namespace ProEventos.Persistence
{
    public class LotePersistence : ILotePersistence
    {
        private readonly ProEventosContext _context;

        public LotePersistence(ProEventosContext proEventosContext)
        {
            _context = proEventosContext;
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            IQueryable<Lote> lotes = _context.Lotes;

            lotes = lotes.AsNoTracking().Where(lote => lote.EventoId == eventoId && lote.Id == loteId);

            return await lotes.FirstOrDefaultAsync();
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> lotes = _context.Lotes;

            lotes = lotes.AsNoTracking().Where(lote => lote.EventoId == eventoId);

            return await lotes.ToArrayAsync();
        }
    }
}