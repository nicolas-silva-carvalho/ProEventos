using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly IGeralPersistence _geralPersistence;
        private readonly ILotePersistence _lotePersistence;
        private readonly IMapper _mapper;

        public LoteService(IGeralPersistence geralPersistence, ILotePersistence lotePersistence, IMapper mapper)
        {
            this._geralPersistence = geralPersistence;
            this._lotePersistence = lotePersistence;
            this._mapper = mapper;
        }

        public async Task<LoteDto[]> SaveLote(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersistence.GetLotesByEventoIdAsync(eventoId);
                if (lotes == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddLote(eventoId, model);
                    }
                    else
                    {
                        var lote = lotes.FirstOrDefault(x => x.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, lote);

                        _geralPersistence.Update<Lote>(lote);
                        await _geralPersistence.SaveChangesAsync();
                    }
                }

                var lotesRetorno = await _lotePersistence.GetLotesByEventoIdAsync(eventoId);
                return _mapper.Map<LoteDto[]>(lotesRetorno);
                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;

                _geralPersistence.Add<Lote>(lote);

                await _geralPersistence.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersistence.GetLoteByIdsAsync(eventoId, loteId);
                if (lote == null) throw new Exception("Lote para deletar não encontrado.");

                _geralPersistence.Delete<Lote>(lote);
                return await _geralPersistence.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersistence.GetLotesByEventoIdAsync(eventoId);
                if (lotes == null) return null;

                var resultado = _mapper.Map<LoteDto[]>(lotes);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersistence.GetLoteByIdsAsync(eventoId, loteId);
                if (lote == null) return null;

                var resultado = _mapper.Map<LoteDto>(lote);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}