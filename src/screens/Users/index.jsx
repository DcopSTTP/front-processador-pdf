import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import { FaUserCog, FaUserTimes, FaSearch, FaFilter, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import * as UserService from "../../service/UserService";
import Swal from "sweetalert2";
import "./styles.css";

export default function GerenciarUsuarios({ onBack, onAddUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarios, setUsuarios] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const carregarUsuarios = async () => {
      setLoading(true);
      try {
        const usuariosData = await UserService.buscarUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        setError(error.message || "Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarios();
  }, []);

  const toggleAdministrador = async (id) => {
    const usuario = usuarios.find(u => u.id === id);
    const novoTipo = usuario.tipoUser === 'admin' ? 'user' : 'admin';
    const isAdmin = novoTipo === 'admin';
    
    const result = await Swal.fire({
      title: 'Confirmar alteração',
      text: `Deseja ${isAdmin ? 'tornar este usuário administrador' : 'remover privilégios de administrador'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e40af',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, alterar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await UserService.alterarTipoUsuario(id, isAdmin);
        
        setUsuarios(prev => prev.map(user => 
          user.id === id 
            ? { ...user, tipoUser: novoTipo }
            : user
        ));

        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Usuário ${isAdmin ? 'promovido a administrador' : 'removido da administração'} com sucesso!`,
          confirmButtonColor: '#1e40af',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.message || 'Erro ao alterar tipo de usuário',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const toggleAtivo = async (id) => {
    const usuario = usuarios.find(u => u.id === id);
    const novoStatus = !usuario.ativo;
    
    const result = await Swal.fire({
      title: 'Confirmar alteração',
      text: `Deseja ${novoStatus ? 'ativar' : 'desativar'} este usuário?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: novoStatus ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sim, ${novoStatus ? 'ativar' : 'desativar'}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await UserService.alterarStatusUsuario(id, novoStatus);
        
        setUsuarios(prev => prev.map(user => 
          user.id === id 
            ? { ...user, ativo: novoStatus }
            : user
        ));

        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
          confirmButtonColor: '#1e40af',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.message || 'Erro ao alterar status do usuário',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.cpf.includes(busca);
    
    const matchStatus = filtroStatus === "todos" || 
                       (filtroStatus === "ativo" && usuario.ativo) ||
                       (filtroStatus === "inativo" && !usuario.ativo);
    
    const matchTipo = filtroTipo === "todos" ||
                     (filtroTipo === "admin" && usuario.tipoUser === "admin") ||
                     (filtroTipo === "usuario" && usuario.tipoUser !== "admin");

    return matchBusca && matchStatus && matchTipo;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="loading-content" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <span>Carregando usuários...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e3a8a',
          marginBottom: '0.5rem'
        }}>Gerenciar Usuários</h1>
        <p style={{ color: '#64748b' }}>
          {usuariosFiltrados.length} usuários encontrados
        </p>
      </div>

      <div className="controles-container" style={{ marginBottom: '2rem' }}>
        <div className="controles-header">
          <div className="busca-container">
            <div className="busca-input-wrapper">
              <FaSearch className="busca-icon" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, email ou CPF..."
                className="form-input busca-input"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filtro-toggle ${showFilters ? 'active' : ''}`}
            >
              <FaFilter />
              {showFilters ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button
            onClick={() => navigate('/cadastrar-usuario')}
            className="add-user-button"
            title="Adicionar novo usuário"
          >
            <FaUserPlus />
            Novo Usuário
          </button>
        </div>

        {showFilters && (
          <div className="filtros-container">
            <div className="filtro-group">
              <label className="form-label">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="form-select"
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Apenas ativos</option>
                <option value="inativo">Apenas inativos</option>
              </select>
            </div>
            <div className="filtro-group">
              <label className="form-label">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="form-select"
              >
                <option value="todos">Todos os tipos</option>
                <option value="admin">Administradores</option>
                <option value="usuario">Usuários comuns</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error" style={{ marginBottom: '1rem' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="usuarios-lista">
        {usuariosFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum usuário encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          usuariosFiltrados.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <div className="usuario-header">
                  <h3 className="usuario-nome">{usuario.nome}</h3>
                  <div className="usuario-badges">
                    <span className={`status-badge ${usuario.ativo ? 'ativo' : 'inativo'}`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    {usuario.tipoUser === 'admin' && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </div>
                </div>
                
                <div className="usuario-detalhes">
                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>CPF:</strong> {usuario.cpf}</p>
                  <p><strong>Gênero:</strong> {usuario.genero === 'M' ? 'Masculino' : usuario.genero === 'F' ? 'Feminino' : usuario.genero === 'O' ? 'Outro' : 'Não informado'}</p>
                  <p><strong>Tipo:</strong> {usuario.tipoUser === 'admin' ? 'Administrador' : 'Usuário'}</p>
                  <p><strong>Cadastro:</strong> {formatDate(usuario.createdAt)}</p>
                  <p><strong>Atualização:</strong> {formatDate(usuario.updatedAt)}</p>
                </div>
              </div>

              <div className="usuario-acoes">
                <button
                  onClick={() => toggleAdministrador(usuario.id)}
                  className={`acao-btn ${usuario.tipoUser === 'admin' ? 'admin-active' : 'admin-inactive'}`}
                  title={usuario.tipoUser === 'admin' ? 'Remover privilégios de admin' : 'Tornar administrador'}
                >
                  <FaUserCog />
                  {usuario.tipoUser === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                </button>
                
                <button
                  onClick={() => toggleAtivo(usuario.id)}
                  className={`acao-btn ${usuario.ativo ? 'desativar' : 'ativar'}`}
                  title={usuario.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                >
                  <FaUserTimes />
                  {usuario.ativo ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="voltar-button"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem'
          }}
        >
          ← Voltar
        </button>
      )}
    </div>
  );
}