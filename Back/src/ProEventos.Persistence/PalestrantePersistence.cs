using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class PalestrantePersistence : IPalestrantePersistence
    {
        private readonly ProEventosContext _context;

        public PalestrantePersistence(ProEventosContext proEventosContext)
        {
            _context = proEventosContext;
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(redesSociais => redesSociais.RedesSociais);

            if (includeEventos)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(evento => evento.Evento);
            }

            query = query.AsNoTracking().OrderBy(palestrante => palestrante.Id).Where(palestrante => palestrante.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(redesSociais => redesSociais.RedesSociais);

            if (includeEventos)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(evento => evento.Evento);
            }

            query = query.AsNoTracking().OrderBy(palestrante => palestrante.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestrateId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(redesSociais => redesSociais.RedesSociais);

            if (includeEventos)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(evento => evento.Evento);
            }

            query = query.AsNoTracking().OrderBy(palestrante => palestrante.Id).Where(palestrante => palestrante.Id == palestrante.Id);

            return await query.FirstOrDefaultAsync();
        }
    }
}