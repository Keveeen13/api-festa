import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState(""); // Para armazenar a busca
  const [searchResults, setSearchResults] = useState([]); // Resultados da busca

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleSearchById = async () => {
    if (!search) return alert("Digite um ID para buscar!");
    try {
      const response = await api.get(`/products/${search}`);
      setSearchResults([response.data]); // Retorna um único produto
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  const handleSearchByName = async () => {
    if (!search) return alert("Digite um nome para buscar!");
    try {
      const response = await api.get(`/products/search/${search}`);
      setSearchResults(response.data); // Retorna uma lista de produtos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    if (!form.name || !form.price) {
      return alert("Por favor, preencha todos os campos.");
    }

    try {
      if (editing) {
        // Atualizar produto existente
        await api.put(`/products/${editing.id}`, form);
        alert("Produto atualizado com sucesso!");
        setEditing(null); // Limpa o estado de edição
      } else {
        // Criar novo produto
        await api.post("/products", form);
        alert("Produto criado com sucesso!");
      }

      setForm({ name: "", price: "" }); // Reseta o formulário
      fetchProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error("Erro ao criar ou atualizar produto:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price });
    setEditing(product); // Define o estado de edição com o produto atual
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) {
      return; // Se o usuário cancelar, não faz nada
    }

    try {
      await api.delete(`/products/${id}`);
      alert("Produto deletado com sucesso!");
      fetchProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Ocorreu um erro ao deletar. Tente novamente.");
    }
  };

  return (
    <>
      <header className="App-header">
        <h1>CRUD de Produtos</h1>
      </header>

      <main className="App-main">
        <div className="App-container">
          {/* Campo de busca */}
          <div className="App-search">
            <input
              type="text"
              placeholder="Buscar por ID ou Nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearchById}>Buscar por ID</button>
            <button onClick={handleSearchByName}>Buscar por Nome</button>
          </div>

          {/* Resultados da busca */}
          {searchResults.length > 0 && (
            <div className="App-search-results">
              <h2>Resultados da Busca</h2>
              <ul>
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <strong>{product.name}</strong> - R$ {product.price}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modals">
            {/* Criar ou Editar Produto */}
            <div className="card-product App-card-create-product">
              <h2>{editing ? "Editar Produto" : "Criar Produto"}</h2>
              <form onSubmit={handleCreate}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Preço"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <button type="submit">{editing ? "Salvar" : "Criar"}</button>
              </form>
            </div>

            {/* Lista de Produtos */}
            <div className="card-product App-card-list-products">
              <h2>Lista de Produtos</h2>
              <ul>
                {products.map((product) => (
                  <li key={product.id}>
                    <strong>{product.name}</strong> - R$ {product.price}
                    <div>
                      <button onClick={() => handleEdit(product)}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(product.id)}>
                        Deletar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
