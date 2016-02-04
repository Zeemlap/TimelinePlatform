using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public static class TaskExtensions
    {
        public struct CultureAwaiter<T> : ICriticalNotifyCompletion, INotifyCompletion
        {
            private readonly Task<T> _task;

            public bool IsCompleted
            {
                get
                {
                    return _task.IsCompleted;
                }
            }

            public CultureAwaiter(Task<T> task)
            {
                _task = task;
            }

            public CultureAwaiter<T> GetAwaiter()
            {
                return this;
            }

            public T GetResult()
            {
                return _task.GetAwaiter().GetResult();
            }

            public void OnCompleted(Action continuation)
            {
                throw new NotImplementedException();
            }

            public void UnsafeOnCompleted(Action continuation)
            {
                var currentCulture1 = Thread.CurrentThread.CurrentCulture;
                var currentUICulture1 = Thread.CurrentThread.CurrentUICulture;
                _task.ConfigureAwait(false).GetAwaiter().UnsafeOnCompleted(delegate
                {
                    var currentCulture2 = Thread.CurrentThread.CurrentCulture;
                    var currentUICulture2 = Thread.CurrentThread.CurrentUICulture;
                    Thread.CurrentThread.CurrentCulture = currentCulture1;
                    Thread.CurrentThread.CurrentUICulture = currentUICulture1;
                    try
                    {
                        continuation();
                    }
                    finally
                    {
                        Thread.CurrentThread.CurrentCulture = currentCulture2;
                        Thread.CurrentThread.CurrentUICulture = currentUICulture2;
                    }
                });
            }
        }

        public struct CultureAwaiter : ICriticalNotifyCompletion, INotifyCompletion
        {
            private readonly Task _task;

            public bool IsCompleted
            {
                get
                {
                    return this._task.IsCompleted;
                }
            }

            public CultureAwaiter(Task task)
            {
                this._task = task;
            }

            public TaskExtensions.CultureAwaiter GetAwaiter()
            {
                return this;
            }

            public void GetResult()
            {
                this._task.GetAwaiter().GetResult();
            }

            public void OnCompleted(Action continuation)
            {
                throw new NotImplementedException();
            }

            public void UnsafeOnCompleted(Action continuation)
            {
                var currentCulture1 = Thread.CurrentThread.CurrentCulture;
                var currentUICulture1 = Thread.CurrentThread.CurrentUICulture;
                _task.ConfigureAwait(false).GetAwaiter().UnsafeOnCompleted(delegate
                {
                    var currentCulture2 = Thread.CurrentThread.CurrentCulture;
                    var currentUICulture2 = Thread.CurrentThread.CurrentUICulture;
                    Thread.CurrentThread.CurrentCulture = currentCulture1;
                    Thread.CurrentThread.CurrentUICulture = currentUICulture1;
                    try
                    {
                        continuation();
                    }
                    finally
                    {
                        Thread.CurrentThread.CurrentCulture = currentCulture2;
                        Thread.CurrentThread.CurrentUICulture = currentUICulture2;
                    }
                });
            }
        }

        public static CultureAwaiter<T> RetainCurrentCultureOverAsyncFlow<T>(this Task<T> task)
        {
            return new CultureAwaiter<T>(task);
        }

        public static CultureAwaiter RetainCultureOverAsyncFlow(this Task task)
        {
            return new CultureAwaiter(task);
        }
    }
}
