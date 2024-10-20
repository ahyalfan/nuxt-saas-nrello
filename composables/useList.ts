// composable ini berbeda dengan store, karena ini hanya akan cersifat local
// jadi gini misal useList ini di gunakan di component a dan b, ketika a meenggunakan useList maka useList di component b
// tidak berpengaruh apapun, nah kalau store bisa berpengaruh karena store nilanya global
export const useList = () => {
  async function destroy(id: string, onDestroy?: () => void) {
    try {
        await useFetch(`/api/lists/${id}`, {
          method: "DELETE",
        });
        onDestroy?.();
    } catch (e: any) {
      ElNotification({
        title: "Error",
        message: e.message || "Something went wrong",
        type: "error",
        position: "top-left",
      });
    }
  }

  
  async function update(id: string, data: Record<string, unknown>) {
    await useFetch(`/api/lists/${id}`, {
      body: data,
      method: "PUT",
      watch: false,
    });
  }

  return {
    destroy,
    update,
  };

}
