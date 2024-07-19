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
    public class EventoPersistence : IEventoPersistence
    {
        private readonly ProEventosContext _context;

        public EventoPersistence(ProEventosContext proEventosContext)
        {
            _context = proEventosContext;
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(lotes => lotes.Lotes).Include(redesSociais => redesSociais.RedesSociais);

            if (includePalestrantes)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(palestrantes => palestrantes.Palestrante);
            }

            query = query.OrderBy(evento => evento.Id).Where(evento => evento.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(lotes => lotes.Lotes).Include(redesSociais => redesSociais.RedesSociais);

            if (includePalestrantes)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(palestrantes => palestrantes.Palestrante);
            }

            query = query.OrderBy(evento => evento.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(lotes => lotes.Lotes).Include(redesSociais => redesSociais.RedesSociais);

            if (includePalestrantes)
            {
                query = query.Include(palestrantesEventos => palestrantesEventos.PalestrantesEventos).ThenInclude(palestrantes => palestrantes.Palestrante);
            }

            query = query.OrderBy(evento => evento.Id).Where(evento => evento.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }
    }
}