export const useBoard = () => {
  async function destroy(id: string, onDestroy?: () => void) {
    try {
      
           const res = confirm("Are you sure you want to destroy?")
      if (res) {  // jika user menekan tombol ok, maka proses delete dijalanka
             await useFetch(`/api/boards/${id}`, {
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

  return {
    destroy,
  };
};