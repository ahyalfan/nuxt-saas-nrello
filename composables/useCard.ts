export const useCard = () => {
  async function destroy(
    listId: string,
    cardId: string,
    onDestroy?: () => void
  ) {
    try {
            const res = confirm("Are you sure you want to destroy?")
      if (res) {  // jika user menekan tombol ok, maka proses delete dijalanka
             await useFetch(`/api/lists/${listId}/cards/${cardId}`, {
                method: "DELETE",
              });
              onDestroy?.();  
      }
    } catch (e: any) {
      ElNotification({
        title: "Error",
        message: e.message || "Something went wrong",
        type: "error",
        position: "top-left",
      });
    }
  }

  async function update(
    listId: string,
    cardId: string,
    data: Record<string, unknown>
  ) {
    console.log(data)
    await useFetch(`/api/lists/${listId}/cards/${cardId}`, {
      body: data,
      method: "PUT",
      watch: false,
    });
  }

  return {
    destroy,
    update,
  };
};