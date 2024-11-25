import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import InputMask from "react-input-mask";

const api = axios.create({
  baseURL: "http://localhost:3000", // Porta do backend de festas
});

function App() {
  const [festas, setFestas] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    local: "",
    valorIngresso: "",
  });
  const [editing, setEditing] = useState(null);

  // Fetch festas from API
  useEffect(() => {
    fetchFestas();
  }, []);

  const fetchFestas = async () => {
    try {
      const response = await api.get("/viewfestas");
      setFestas(response.data);
    } catch (error) {
      console.error("Erro ao buscar festas:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.data || !form.local || !form.valorIngresso) {
      return alert("Por favor, preencha todos os campos.");
    }

    try {
      const valorSemMascara = form.valorIngresso.replace(/[^\d,]/g, "").replace(",", ".");
      const dados = {
        ...form,
        valorIngresso: parseFloat(valorSemMascara),
      };

      if (editing) {
        // Atualizar festa existente
        await api.put(`/festas/${editing.id}`, dados);
        alert("Festa atualizada com sucesso!");
        setEditing(null);
      } else {
        // Criar nova festa
        await api.post("/festas", dados);
        alert("Festa criada com sucesso!");
      }

      setForm({ nome: "", data: "", local: "", valorIngresso: "" });
      fetchFestas();
    } catch (error) {
      console.error("Erro ao criar ou atualizar festa:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  const handleEdit = (festa) => {
    setForm({
      nome: festa.nome,
      data: festa.data,
      local: festa.local,
      valorIngresso: festa.valorIngresso,
    });
    setEditing(festa);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta festa?")) {
      return;
    }

    try {
      await api.delete(`/festas/${id}`);
      alert("Festa deletada com sucesso!");
      fetchFestas();
    } catch (error) {
      console.error("Erro ao deletar festa:", error);
      alert("Ocorreu um erro ao deletar. Tente novamente.");
    }
  };

  return (
    <>
      <header className="App-header">
        <h1>CRUD de Festas</h1>
      </header>

      <main className="App-main">
        <div className="App-container">
          {/* Criar ou Editar Festa */}
          <div className="card-product App-card-create-festa">
            <h2>{editing ? "Editar Festa" : "Criar Festa"}</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <InputMask
                mask="99/99/9999" // Máscara para data (DD/MM/YYYY)
                placeholder="Data (DD/MM/AAAA)"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
              <input
                type="text"
                placeholder="Local"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
              />
              <InputMask
                mask="R$ 999,99" // Máscara para valor
                placeholder="Valor do Ingresso (R$)"
                value={form.valorIngresso}
                onChange={(e) =>
                  setForm({ ...form, valorIngresso: e.target.value })
                }
              />
              <button type="submit">{editing ? "Salvar" : "Criar"}</button>
            </form>
          </div>

          {/* Lista de Festas */}
          <div className="card-product App-card-list-festas">
            <h2>Lista de Festas</h2>
            <ul>
              {festas.map((festa) => (
                <li key={festa.id}>
                  <strong>{festa.nome}</strong> - {festa.data} - {festa.local} -
                  R$ {festa.valorIngresso}
                  <div>
                    <button onClick={() => handleEdit(festa)}>Editar</button>
                    <button onClick={() => handleDelete(festa.id)}>
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
