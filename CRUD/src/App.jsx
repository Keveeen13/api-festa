import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL do backend
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editing, setEditing] = useState(null);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Preencha todos os campos!");
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm({ name: "", price: "" });
      setEditing(null);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, price: product.price });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <>
      <header className="App-header">
        <h1>CRUD de Produtos</h1>
      </header>

      <main className="App-main">
        <div className="App-container">
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
