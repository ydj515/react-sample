export default function ModalExample() {
  const openModal = () => {
    const dialog = document.getElementById("my_modal_1");

    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  };

  return (
    <div className="p-6">
      <button
        className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        onClick={openModal}
        type="button"
      >
        open modal
      </button>
      <dialog
        id="my_modal_1"
        className="m-auto w-[calc(100vw-2rem)] max-w-md rounded-lg border border-slate-200 bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/40"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="flex justify-end">
            <form method="dialog">
              <button
                className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                type="submit"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
